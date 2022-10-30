import React from 'react';
import Card from './card';
import { useCtx } from './context';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { ToolTips } from './utils';


function CreateAccount() {
   
    const [show, setShow] = React.useState(true);
    const [btndisabled, setBtnDisabled] = React.useState(true);

    const users = useCtx();
    
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            name: '',
        },
        onSubmit: (values, {resetForm}) => {
            let now = new Date();
            alert('Account created successfully', null, 2);
            users.push({name: values.name, 
                        email: values.email, 
                        password: values.password,
                        history: [{ withdraw: '',
                                    deposit: '',
                                    date: now.toLocaleDateString('en-GB'),
                                    time: now.toTimeString(),
                                    balance: 1000}]
            });
            setShow(false);
            resetForm({values:''});
            // setContext(users);
            setBtnDisabled(true);
        },
        validate,
    });
    
    function validate (values) {
        let errors = {};
        let disableBtn = false;

        if (!values.email) {
            errors.email = 'Field required';
            disableBtn = true;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Email should be in the correct format';
            disableBtn = true;
        };
      
        if (!values.name) {
            errors.name = 'Field required';
            disableBtn = true;
        };

        // if (!values.username) {
        //     errors.username = 'Field required';
        //     disableBtn = true;
        // };

        if (!values.password) {
          errors.password = 'Field required';
          disableBtn = true;
        } else if (values.password.length < 8) {
            errors.password = 'Password length must be 8 characters or longer';
            disableBtn = true;
        };
        
        setBtnDisabled(disableBtn);

        return errors;
    };
    
    return (
        <Card 
            bgcolor="primary"
            txtcolor="white"
            header="BadBank"
            title="CREATE A NEW ACCOUNT"
            text={show ? <>Register here to start enjoying the benefits of BadBank</>:<>Click <span className="badge bg-success">Add another account</span> <br/> or <br/> <span className="badge bg-success">Login</span> to access your existing account</>}
            body={
                <form onSubmit={formik.handleSubmit}>
                    Name<br/>
                    <input type="input" autoComplete="username" className="form-control" id="name" placeholder="Enter your name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}/> {formik.touched.name && formik.errors.name ? (<div id="nameError" style={{color:'red'}}>{formik.errors.name}</div>) : null}<br/>
                    {/* Username<br/>
                    <input type="input" autoComplete="username" className="form-control" id="username" placeholder="Enter username" value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur}/> {formik.touched.username && formik.errors.username ? (<div id="nameError" style={{color:'red'}}>{formik.errors.username}</div>) : null}<br/> */}
                    
                    Email address<br/>
                    <input type="input" className="form-control" id="email" placeholder="Enter your email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}/> {formik.touched.email && formik.errors.email ? (<div id="emailError" style={{color:'red'}}>{formik.errors.email}</div>) : null}<br/>
                    Password<br/>
                    <input type="password" autoComplete="current-password" className="form-control" id="password" placeholder="Enter a password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}/>{formik.touched.password && formik.errors.password ? (<div id="pswError" style={{color: 'red'}}>{formik.errors.password}</div>) : null}<br/>
                    <button data-tip data-for="newAccTip" type="submit" className="btn btn-success" disabled={btndisabled}> {show ? "Create Account":"Add another account"}</button>
                    {show ? null:<Link data-tip data-for="existAccTip" to="/login" className="btn btn-success">Login</Link>}
                    <ToolTips></ToolTips>
                </form>
            }
        />
    );
}

export default CreateAccount;