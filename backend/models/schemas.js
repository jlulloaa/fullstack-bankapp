const { Schema, model } = require('mongoose');

// const AccountSchema = model(
//     "accounts",
const AccountSchema = Schema (
        {
            account_nro: Number,
            accont_type: String
        }
    )
// );

// const TransactionSchema = model(
//     "transactions",
const TransactionSchema = Schema (
        {
            timestamp: Date,
            account_nro: Number,
            transaction_type: {type: String,
                enum: {
                    values: ['deposit', 'withdrawal', 'transferin', 'transferout', 'setup'],
                    message: '{VALUE} is not a valid transaction'
                }
            },
            transaction_amount: Number,
            transfer_from: {type: String, required: false},
            transfer_to: {type: String, required: false},
            balance: Number
        }
    )
    // );


const UserSchema = model(
    "users",
    Schema (
        {
            name: {type: String, required: [true, "Must provide your Name"]},
            // username: {type: String, required: false},
            // dob: {type: Date, required: false},
            email: {type: String, required: [true, "Must provide your email"]},
            account: [AccountSchema],
            history: [TransactionSchema],
            // password: {type: String, required: [true, "Must provide a password"]},
            // account_nro: Number
        } //, {timestamps: true}
    )
);
    
module.exports = {UserSchema}; 