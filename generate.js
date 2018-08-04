const faker = require("faker")
const _ = require("lodash")

faker.seed(1234);

const people = _.times(10, () => {
    return {
        id: faker.random.uuid(),
        name: faker.name.findName()
    }
})

const trips = _.times(100, () => {
    return {
        id: faker.random.uuid(),
        title: faker.lorem.sentence(5),
        people: _.uniq(_.times(faker.random.number({ min: 1, max: 5 }),
            () => {
                return faker.random.arrayElement(people).id
            }
        ))
    }
})

const destinations = _.flatMap(trips, trip => {
    return _.times(
        faker.random.number({ min: 1, max: 5 }),
        () => {
            return {
                id: faker.random.uuid(),
                title: faker.address.city(),
                startDate: faker.date.future(1),
                tripId: trip.id,
            }
        }
    )
})

const notes = _.flatMap(destinations, destination => {
    return _.times(
        faker.random.number({ min: 1, max: 15 }),
        () => {
            return {
                id: faker.random.uuid(),
                destinationId: destination.id,
                title: faker.lorem.sentence(3),
                category: faker.random.uuid(),
                cost: faker.random.number(5000),
                startDate: faker.random.boolean()
                    ? faker.date.future(0.1)
                    : undefined
            }
        }
    )
})

module.exports = () => {
    return {
        people,
        trips,
        destinations,
        notes
    }
}
