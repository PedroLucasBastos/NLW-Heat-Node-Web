import prismaClient from '../prisma';

class GetLast3MessagesService {
    async execute() {
        const messages = await prismaClient.message.findMany({
            take: 3, //é aqui que mudo o limite de dados que quero trazer
            orderBy: {
                created_at: "desc"
            }, include: {
                user: true
            }
        });

        //É mais ou menos isso que essa função faz:
        //"SEELEC * FROM MESSAGES LIMIT 3 ORDER BY CREATED_AT DESC"
        return messages;

    }
}

export { GetLast3MessagesService };