import {
    AppState,
    SaluteHandler,
    SaluteRequest,
    SaluteRequestVariable
} from '@salutejs/scenario'


export interface ScenarioAppState extends AppState {

}

export interface ScenarioIntentsVariables extends SaluteRequestVariable {
    product?: string;
    number?: string;
    ordinal?: string;
    category?: string;
    quantity?: string;
}

export interface ScenarioSession extends Record<string, unknown>{
    questionsList?: Question[]
    currentQuestion?: Question
    isFirstQuestion?: boolean
}

export type ScenarioRequest = SaluteRequest<ScenarioIntentsVariables, ScenarioAppState>
export type ScenarioHandler = SaluteHandler<ScenarioRequest, ScenarioSession>

export type Question = {
    id: string
    tour: string
    number: number
    type: string
    question: string
    answer: string
    comments: string
    authors: string
}

export type QuestionAPIResponse = {
    'hydra:member': Question[]
    'hydra:totalItems': number,
    'hydra:view': {
        '@id': string,
        '@type': string,
        'hydra:first': string,
        'hydra:last': string,
        'hydra:next': string
    }
}