import { ScenarioRequest, ScenarioSession } from '../types'
import stringSimilarity from 'string-similarity'

export function getRandomFromArray<T>(arr: T[]): T {
    return arr[Math.floor(arr.length * Math.random())]
}

export function getRandomNumberFromRange(range1: number, range2: number) {
    return Math.floor(Math.random() * (range2 - range1 + 1)) + range1
}

export const deleteNotValidQuestions = (session: ScenarioSession) => {
    if (session.questionsList) {
        session.questionsList = session.questionsList.filter((item, index) => {
            if (
                item.question.includes('<') ||
                item.question.includes('>') ||
                item.question.includes('pic') ||
                item.question.includes('jpg') ||
                item.question.includes('gif') ||
                item.question.includes('1. ') ||
                item.question.includes('3. ') ||
                item.question.includes('5. ') ||
                item.question.includes('7. ') ||
                item.question.includes('9. ') ||
                item.question.includes('10. ') ||
                item.question.includes('20. ') ||
                item.question.includes('30. ') ||
                item.question.includes('[') ||
                item.question.includes(']')
            ) {
                console.log('question deleted', item.question, index)
                return false
            }
            if (
                item.comments && (
                    item.comments.includes('<') ||
                    item.comments.includes('>') ||
                    item.comments.includes('pic') ||
                    item.comments.includes('jpg') ||
                    item.comments.includes('gif')
                )
            ) {
                console.log('comment deleted', item.comments, index)
                return false
            }
            return true
        })
    }
}

export const changeBrackets = (text: string) => {
    let textArr = text.split('')
    for (let i = 0; i < textArr.length; i++) {
        if (textArr[i] === '\"' && (
            i === textArr.length - 1 ||
            textArr[i + 1] === ' ' ||
            textArr[i + 1] === '.' ||
            textArr[i + 1] === ',' ||
            textArr[i + 1] === ':' ||
            textArr[i + 1] === ';'
        )) textArr[i] = '??'
        if (textArr[i] === '\"' && (
            i === 0 ||
            textArr[i - 1] === ' ' ||
            textArr[i - 1] === '\n'
        )) textArr[i] = '??'
    }
    return textArr.join('')
}

export const deleteEnters = (text: string) => {
    return text.replace(/\n/g, ' ')
}

export const checkAnswerSimilarity = (req: ScenarioRequest, answer: string) => {
    const clearAnswer = answer.replace(/[.,\[\]]/g, '')
    console.log('clearAnswer', clearAnswer)
    const asrSimilarity = stringSimilarity.compareTwoStrings(req.message.asr_normalized_message ?? '', clearAnswer.toLowerCase().trim())
    const originalSimilarity = stringSimilarity.compareTwoStrings(req.message.original_text.toLowerCase().trim() ?? '', clearAnswer.toLowerCase().trim())
    const normalizedSimilarity = stringSimilarity.compareTwoStrings(req.message.human_normalized_text.toLowerCase().trim() ?? '', clearAnswer.toLowerCase().trim())
    console.log('asrSimilarity', asrSimilarity)
    console.log('originalSimilarity', originalSimilarity)
    console.log('normalizedSimilarity', normalizedSimilarity)
    return Math.max(asrSimilarity, originalSimilarity, normalizedSimilarity)
}

