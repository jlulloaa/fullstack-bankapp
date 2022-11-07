const { Schema, model } = require('mongoose');

const UserSchema = model(
    "users",
    Schema (
        {
            name: {type: String, 
                required: [true, "Must provide your Name"]},
                // username: {type: String, required: false},
                // dob: {type: Date, required: false},
                email: {type: String, required: [true, "Must provide your email"]},
                password: {type: String, required: [true, "Must provide a password"]},
                // account_nro: Number
        } //, {timestamps: true}
    )
);

const AccountSchema = model(
    "accounts",
    Schema (
        {
            account_nro: Number,
            accont_type: String
        }
    )
);

const TransactionSchema = model(
    "transactions",
    Schema (
        {
            account_nro: Number,
            transact_type: {type: String,
                enum: {
                    values: ['Deposit', 'Withdrawal', 'Transfer'],
                    message: '{VALUE} is not a valid transaction'
                }
            }
        }
    )
    );

module.exports = {UserSchema, AccountSchema, TransactionSchema}; 