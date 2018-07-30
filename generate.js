const faker = require("faker")
const _ = require("lodash")

const samples = 100

module.exports = () => {
    return {
        people: _.times(samples, id => {
            return {
                id,
                name: faker.name.findName()
            }
        }),
        trips: _.times(samples, id => {
            const startDate = faker.date.future(1)
            const endDate = faker.date.future(1, startDate)
            return {
                id,
                startDate,
                endDate,
                destinations: [
                    {
                        id: 0,
                        title: faker.lorem.sentence(5),
                        startDate
                    },
                    ..._.times(faker.random.number({ min: 1, max: 5 }), id => {
                        return {
                            id: id + 1,
                            title: faker.address.city(),
                            startDate: faker.date.between(startDate, endDate)
                        }
                    })
                ],
                people: _.times(faker.random.number({ min: 1, max: 5 }), n => {
                    return faker.random.number(samples)
                })
            }
        })
    }
}
