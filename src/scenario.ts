import { closeApp } from './utils/responses';
import { ScenarioRequest, Question } from './types';
import { SmartAppBrainRecognizer } from '@salutejs/recognizer-smartapp-brain'
import {
    createIntents,
    createMatchers,
    createSaluteRequest,
    createSaluteResponse,
    createScenarioWalker,
    createSystemScenario,
    createUserScenario,
    NLPRequest,
    NLPResponse,
    SaluteRequest
} from '@salutejs/scenario'
import { SaluteMemoryStorage } from '@salutejs/storage-adapter-memory'
import { answerHandler, helpHandler, noMatchHandler, questionHandler, rightAnswerHandler, runAppHandler, startAppHandler } from './handlers'
import model from './intents.json'
require('dotenv').config()

const storage = new SaluteMemoryStorage()
const intents = createIntents(model.intents)
const { intent, match, text } = createMatchers<ScenarioRequest, typeof intents>()

const userScenario = createUserScenario<ScenarioRequest>({
    StartApp: {
        match: () => false,
        handle: startAppHandler,
        children: {
            Yes: {
                match: intent('/Да', {confidence: 0.4}),
                handle: ({req, res}, dispatch) => dispatch && dispatch(['Question'])
            },
            No: {
                match: intent('/Нет', {confidence: 0.4}),
                handle: ({res}) => {
                    res.setPronounceText('Тогда до встречи!')
                    closeApp(res)
                }
            }
        }
    },
    Question: {
        match: intent('/Следующий', {confidence: 0.4}),
        handle: questionHandler
    },
    Help: {
        match: intent('/Помощь', {confidence: 0.4}),
        handle: helpHandler
    },
    AnswerWait: {
        match: () => false,
        handle: () => {console.log('Answer wait')},
        children: {
            Question: {
                match: intent('/Следующий', {confidence: 0.4}),
                handle: questionHandler
            },
            RightAnswer: {
                match: req => {
                    return intent('/Ответ', {confidence: 0.4})(req)
                },
                handle: rightAnswerHandler,
            },
            Help: {
                match: intent('/Помощь', {confidence: 0.4}),
                handle: helpHandler
            },
            Answer: {
                match: (req) => !!req.message.original_text,
                handle: answerHandler
            }
        }
    }
})

const systemScenario = createSystemScenario({
    RUN_APP: runAppHandler,
    NO_MATCH: noMatchHandler
})

const scenarioWalker = createScenarioWalker({
    recognizer: new SmartAppBrainRecognizer(process.env.SMARTAPP_BRAIN_TOKEN),
    intents,
    systemScenario,
    userScenario
})

export const handleNlpRequest = async (request: NLPRequest): Promise<NLPResponse> => {
    const req = createSaluteRequest(request)
    const res = createSaluteResponse(request)

    const sessionId = request.uuid.userId
    const session = await storage.resolve(sessionId)

    await scenarioWalker({ req, res, session })

    await storage.save({ id: sessionId, session })

    return res.message
}