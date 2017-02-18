const _ = require('lodash');

const cards = [
    'would live to be 120 years old and still achieve nothing',
    'would happily listen to one song for the rest of their life',
    `think's they are a big deal`,
    `is incredibly stupid, but super lucky`,
    `plays too much video games`,
    `eats too much broccoli`,
    `drinks too much coffee`,
    `reads too much self-help`,
    `makes too much money`,
    `thinks they are a big deal`,
    `loves themselves way more than they should`,
    `is probably very good in bed`,
    `probably has some odd fetishes`,
    `looks better with glasses`,
    `needs to see a fashion guru`,
    `could live in a bathroom for the rest of their life`,
    `would glue their eyes shut with super glue`,
    `is most likely to actuallly be a vampire`,
    `is habouring negative feelings`,
    `could do with a telling off`,
    `has horrible music taste`,
    `is trying way too hard`,
    `would eat a worm straight from the ground`,
    `would make a good predator`,
    `would make a good rabbit`,
    `should be sent to a distant planet`,
    `would you want as your backup if shit went down`,
    `is probably thinking about something else right now`
];

module.exports = {
    generate() {
        return _.sampleSize(cards, 10);
    }
};