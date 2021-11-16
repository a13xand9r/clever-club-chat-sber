import { ScenarioHandler } from './types';
import * as dictionary from './system.i18n'
import axios from 'axios';
import { getQuestions } from './api/api';
import { changeBrackets, checkAnswerSimilarity, deleteEnters, deleteNotValidQuestions, getRandomNumberFromRange } from './utils/utils';
// stringSimilarity = require("string-similarity")
import stringSimilarity from 'string-similarity'
require('dotenv').config()


export const runAppHandler: ScenarioHandler = ({ req, res }, dispatch) => {
    dispatch && dispatch(['StartApp'])
}

export const startAppHandler: ScenarioHandler = ({ req, res, session }) => {
    const keyset = req.i18n(dictionary)
    const responseText = keyset('Привет')
    res.appendBubble(responseText)
    res.setPronounceText(responseText)
    res.appendSuggestions(['Да', 'Нет'])
    res.setAutoListening(true)

    session.isFirstQuestion = true
}

export const noMatchHandler: ScenarioHandler = ({ req, res }) => {
    const keyset = req.i18n(dictionary)
    const responseText = keyset('404')
    res.appendBubble(responseText)
    res.setPronounceText(responseText)
}
export const helpHandler: ScenarioHandler = ({ req, res }) => {
    const keyset = req.i18n(dictionary)
    res.appendBubble(keyset('Помощь'))
    res.setPronounceText(keyset('Помощь'))
}

export const questionHandler: ScenarioHandler = async ({ req, res, session }, dispatch) => {
    const keyset = req.i18n(dictionary)

    if (session.questionsList?.length){
        session.questionsList = session.questionsList?.filter((_, index) => index !== 0)
        session.currentQuestion = session.questionsList[0]
    }

    if (!session.questionsList || !session.questionsList.length){
        const { questions } = await getQuestions(getRandomNumberFromRange(1, 12050), 10)
        session.questionsList = questions
        console.log('session length Before', session.questionsList?.length, '\n')
        deleteNotValidQuestions(session)
        console.log('session length After', session.questionsList?.length, '\n')
        session.currentQuestion = session.questionsList[0]
    }
    console.log('currentQuestion', session.currentQuestion)

    res.setPronounceText(`${session.isFirstQuestion ? 'Первый вопрос:\n' : ''}${session.currentQuestion?.authors ? `Автор вопроса — ${session.currentQuestion?.authors}.\n` : ''}${session.currentQuestion?.question}`)
    res.appendBubble(`${session.isFirstQuestion ? 'Первый вопрос:\n\n' : ''}${session.currentQuestion?.authors ? `Автор вопроса — ${session.currentQuestion?.authors}.\n\n` : ''}${changeBrackets(session.currentQuestion?.question as string)}`)
    res.appendSuggestions(['Ответ', 'Хватит'])

    session.isFirstQuestion = false

    dispatch && dispatch(['AnswerWait'])
}

export const answerHandler: ScenarioHandler = ({ req, res, session }, dispatch) => {
    const keyset = req.i18n(dictionary)
    let responseText = ''

    console.log('human_normalized_text',req.message.human_normalized_text)
    console.log('asr_normalized_message',req.message.asr_normalized_message)
    console.log('normalized_text',req.message.normalized_text)

    const similarity = checkAnswerSimilarity(req, session.currentQuestion?.answer as string)

    console.log('similarity', similarity)

    if (session.currentQuestion) {
        if (similarity > 0.65) {
            responseText = keyset('Верно', {
                answer: session.currentQuestion.answer.trim(),
                comment: changeBrackets(deleteEnters(session.currentQuestion?.comments ? session.currentQuestion?.comments.trim() : ''))
            })
            res.appendSuggestions(['Следующий', 'Хватит'])
        } else if (similarity <= 0.65 && similarity > 0.3){
            responseText = keyset('Вроде верно', {
                answer: session.currentQuestion.answer.trim(),
                comment: changeBrackets(deleteEnters(session.currentQuestion?.comments ? session.currentQuestion?.comments.trim() : ''))
            })
            res.appendSuggestions(['Следующий', 'Хватит'])
        } else {
            responseText = keyset('Неверно')
            res.appendSuggestions(['Сдаюсь', 'Хватит'])
            dispatch && dispatch(['AnswerWait'])
        }
    }
    res.setPronounceText(responseText)
    res.appendBubble(responseText)
}

export const rightAnswerHandler: ScenarioHandler = ({ req, res, session }, dispatch) => {
    const keyset = req.i18n(dictionary)
    let responseText = keyset('Правильный ответ', {
        answer: session.currentQuestion?.answer.trim(),
        comment: changeBrackets(deleteEnters(session.currentQuestion?.comments ? session.currentQuestion?.comments.trim() : ''))
    })
    res.setPronounceText(responseText)
    res.appendBubble(responseText)
    res.appendSuggestions(['Следующий', 'Хватит'])
}