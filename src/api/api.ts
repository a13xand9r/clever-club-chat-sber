import { QuestionAPIResponse } from './../types';
import axios from 'axios'

export const getQuestions = async (page: number, itemsPerPage: number) => {
    try {
        const { data } = await axios.get<QuestionAPIResponse>(`http://www.db.chgk.info/questions?page=${page}&itemsPerPage=${itemsPerPage}&questionType%5B%5D=chgk`)
        console.log('length', data['hydra:member'].length)
        return {
            questions: data['hydra:member'],
            totalItems: data['hydra:totalItems'],
            view: data['hydra:view']
        }
    } catch (error) {
        console.log('AXIOS ERROR', error)
        return {
            questions: [],
            totalItems: 0,
            view: null
        }
    }

}