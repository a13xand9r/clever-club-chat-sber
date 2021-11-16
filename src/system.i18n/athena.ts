export const athena = {
    Привет: 'Здравствуйте. Я умею задавать умные вопросы. Попробуйте ответить правильно. Начнём?',
    404: 'Чтобы узнать ответ, скажите «Ответ», чтобы услышать следующий вопрос, скажите «Следующий».',
    'Верно': [
        'Верно! {answer}\n{comment}',
        'Правильно! {answer}\n{comment}',
        'Все верно! {answer}\n{comment}',
    ],
    'Вроде верно': [
        'Вроде бы верно. {answer}\n{comment}',
        'Кажется что верно. {answer}\n{comment}',
        'Кажется правильно. {answer}\n{comment}',
        'Вроде бы всё правильно. {answer}\n{comment}',
    ],
    'Неверно': [
        'Неправильно, попробуйте ещё раз',
        'Неверно, попробуйте ещё раз',
        'Нет, неправильно. Вот вам ещё попытка',
        'Не совсем, подумайте ещё',
        'Неправильно, подумайте ещё немного',
    ],
    'Правильный ответ': [
        'Правильный ответ: \n{answer} \n\n{comment}',
    ],
};