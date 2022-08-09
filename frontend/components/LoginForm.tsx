import React, { useState } from 'react'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isLoggedIn, setExpiresIn, setJwtToken, setRefreshToken } from '../helpers/authHelper';
import { useApolloClient, useLazyQuery } from '@apollo/client';
import { LOGIN } from '../services/graphql/queries';
import { getErrorMessage } from '../helpers/errorParser';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error_message, setErrorMessage] = useState('');

    const client = useApolloClient()
    const [login] = useLazyQuery(LOGIN)

    const route = useRouter();

    useEffect(() => {
        const isAuthenticated = isLoggedIn();
        if(isAuthenticated) route.push('/tips');
    }, []);

    async function tryLogin(event: any) {
        event.preventDefault();
        if(!username || !password){
            setErrorMessage('Credentials must be provided');
            return
        }else setErrorMessage('');

        try {
            await client.clearStore()
            const { data, error } = await login({
                variables: {
                    username,
                    password
                },
            });
            if (data?.Login != null) {
                setJwtToken(data.Login.bearer_token);
                setRefreshToken(data.Login.refresh_token);
                setExpiresIn(data.Login.expires_in);
                window.location = '/tips' as any;
            }
            if(error){
                setErrorMessage(getErrorMessage(error));
            }
        } catch (error) { console.error(error)
            setErrorMessage(getErrorMessage(error));
        }
    }
    
    return (
        <section className="h-screen">
            <div className="container px-6 py-12 h-full">
                <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
                    <div className="md:w-8/12 lg:w-6/12 mb-12 md:mb-0">
                        <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                            className="w-full"
                            alt="Phone image"
                        />
                    </div>
                    <div className="md:w-8/12 lg:w-5/12 lg:ml-20">
                        <form>
                            <div className="mb-6">
                                <input
                                    type="text"
                                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e)=>setUsername(e.target.value)}
                                />
                            </div>
                            <div className="mb-6">
                                <input
                                    type="password"
                                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e)=>setPassword(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={(e)=>tryLogin(e)}
                                className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                                data-mdb-ripple="true"
                                data-mdb-ripple-color="light"
                            >
                                Login
                            </button>
                            { 
                                error_message ?                           
                                    <div role="alert">
                                        <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 my-2 text-red-700">
                                            <p>{error_message}</p>
                                        </div>
                                    </div> 
                                :
                                <></> 
                            }
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LoginForm