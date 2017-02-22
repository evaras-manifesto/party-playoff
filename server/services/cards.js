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
    `is harbouring negative feelings`,
    `could do with a telling off`,
    `has horrible music taste`,
    `is trying way too hard`,
    `would eat a worm straight from the ground`,
    `would make a good predator`,
    `would make a good rabbit`,
    `should be sent to a distant planet`,
    `would you want as your backup if shit went down`,
    `has never experienced true anger`,
    `can be a bit of a pretentious snob`,
    `is going to go down in the history books`,
    `changes their mind every few days`,
    `is a closet communist`,
    `probably watched Sex and the City last night`,
    `has already done something stupid today`,
    `wears socks with sandals`,
    `is probably thinking about something else right now`,
    `thinks that they can save the world with love?`,
    `thinks that they can save the world with logic?`,
    `just doesn't know when to stop!?`,
    `could always do with one more tequila`,
    `is plotting against everyone right now`,
    `is the crazy one on the bus you don't want to sit next to`,
    `thinks they are a top business mogul`,
    `eats like a peasant`,
    `humour is most misunderstood`,
    `is unintentionally hilarious`,
    `would give a home to 9 feral cats`,
    `would you like to be stranded with on a desert island`,
    `would you like to know what they are really thinking`,
    `deserves a holiday`,
    `needs a hug`,
    `thinks they are a professional athlete`,
    `gives awful hugs`,
    `needs a chill pill`,
];

module.exports = {
    generate() {
        return _.sampleSize(cards, 40);
    },

    generateRound(index) {
        return {
            index: index,
            votes: [],
            guesses: [],
            winners:[]
        }
    }
};