const Alexa = require('alexa-sdk');
const fetch = require('node-fetch');

const baseurl = 'https://grocery-gallery.herokuapp.com/alexa/';
const API_KEY = '2039rj0aeijf98je0rij0ej9r0'

//Speech Constants

const FRIDGE_ITEMS = "Here are the items in your fridge: ";
const GROCERY_ITEMS = "Here are the items in your grocery list: ";
const ADD_GROCERY = " has been added to your grocery list"


function getItemList(path, callback) {

    const options = {
        headers: {'X-SECRET-API-KEY': API_KEY}
    }

    fetch(baseurl + path, options)
    .then(res => res.json())
    .then(json => json.map(function(val) {
      return val.name;
      }).join(', '))
    .then(items => callback(items));
}

function postRecord(path, record, callback) {
    
        const options = {
            method: "POST",
            headers: {
                'X-SECRET-API-KEY': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(record)
        }
    
        fetch(baseurl + path, options)
        .then(res => res.json())
        .then(item => callback(item));
    }


const handlers = {

    'ShowFridgeItemsIntent': function() {

        let self = this;

        getItemList('fridge', function(items) {
            console.log("Here are your items again: " + items);
            speechOutput = FRIDGE_ITEMS + items;
            self.emit(':tell', speechOutput);
        });
    },

    'GetGroceryItemsIntent': function() {

        let self = this;

        getItemList('grocery', function(items) {
        speechOutput = GROCERY_ITEMS + items;
        self.emit(':tell', speechOutput)
        });

    },

    'AddGroceryItemIntent': function() {
        
                let self = this;
                const foodItem = this.event.request.intent.slots.food.value 


                postRecord('grocery', foodItem, function(item) {
                speechOutput = foodItem + ADD_GROCERY
                self.emit(':tell', speechOutput)
                });
        
            },

    'LaunchRequest': function () {
        this.emit(':tell' + "Starting Grocery Gallery");
    },

    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};