const faker = require("faker")
const _ = require("lodash")

const samples = 100

const people = _.times(samples, () => {
    return {
        id: faker.random.uuid(),
        name: faker.name.findName()
    }
})

module.exports = () => {
    return {
        people,
        trips: _.times(samples, () => {
            const startDate = faker.date.future(1)
            const endDate = faker.date.future(1, startDate)
            return {
                id: faker.random.uuid(),
                title: faker.lorem.sentence(5),
                destinations: _.times(
                    faker.random.number({ min: 1, max: 5 }),
                    () => {
                        return {
                            id: faker.random.uuid(),
                            title: faker.address.city(),
                            startDate: faker.date.between(startDate, endDate),
                            notes: _.times(
                                faker.random.number({ min: 1, max: 15 }),
                                () => {
                                    return {
                                        id: faker.random.uuid(),
                                        title: faker.lorem.sentence(3),
                                        category: faker.random.uuid(),
                                        cost: faker.random.number(5000),
                                        startDate: faker.random.boolean()
                                            ? faker.date.between(
                                                  startDate,
                                                  endDate
                                              )
                                            : undefined
                                    }
                                }
                            )
                        }
                    }
                ),
                people: _.times(faker.random.number({ min: 1, max: 5 }), () => {
                    return faker.random.arrayElement(people).id
                })
            }
        })
    }
}
