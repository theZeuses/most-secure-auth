import React, { useEffect, useState } from 'react'
import { isLoggedIn } from '../helpers/authHelper';
import { useRouter } from 'next/router';
import { useApolloClient, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_POSTS } from '../services/graphql/queries';
import { getErrorMessage } from '../helpers/errorParser';
import parser from 'react-html-parser';
import { INSERT_LIKE } from '../services/graphql/mutation';

function Post() {
    const route = useRouter();
    const client = useApolloClient();
    const [getPosts] = useLazyQuery(GET_POSTS);
    const [insertLike] = useMutation(INSERT_LIKE);
    const [likes_count, setLikesCount] = useState(0);
    const [post_id, setPostId] = useState();
    const [content, setContent] = useState('loading...');
    const [pageLoading, setPageLoading] = useState(true);
    useEffect(() => {
        const asyncBlock = async () => {
            const isAuthenticated = isLoggedIn();
            if(!isAuthenticated) await route.push('/');

            try{
                await client.resetStore();
                const { loading, error, data } = await getPosts();
    
                if(loading) console.log(loading);
                if(error) console.log(getErrorMessage(error));
                if(data){
                    if(data.posts.length > 0){
                        setLikesCount(data.posts[0].summary.likes_count);
                        setContent(data.posts[0].text);
                        setPostId(data.posts[0].id);
                        setPageLoading(false);
                    }
                }
            }catch(err){
                console.log(getErrorMessage(err));
            }
        }

        asyncBlock();
    }, []);

    async function newLike(event: any){
        event.preventDefault();
        console.log(post_id)
        if(!post_id) return;

        try{
            await client.resetStore();
            const { data } = await insertLike({
                variables: {
                    post_id:parseInt(post_id),
                    ip: '11.11.11.11'
                }
            });

            if(data){
                if(data.createLike){
                    setLikesCount(likes_count + 1);
                }
            }
        }catch(err){
            console.log(getErrorMessage(err));
        }
    }

    return (
        <div className='flex justify-center items-center h-screen'>
            {
                pageLoading
                ? 
                <button disabled type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex items-center">
                    <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                    </svg>
                    Loading...
                </button>
                :
                <div className="flex bg-white shadow-lg rounded-lg mx-4 md:mx-auto my-56 max-w-md md:max-w-2xl ">
                    <div className="flex items-start px-4 py-6">
                        <img className="w-12 h-12 rounded-full object-cover mr-4 shadow" src="/shamil.jpg" alt="avatar" />
                        <div className="">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 -mt-1">Al-sany Samil</h2>
                                <small className="text-sm text-gray-700">Just Now</small>
                            </div>
                            <p className="text-gray-700">Joined Today.</p>
                            <p className="mt-3 text-gray-700 text-sm">
                                {parser(content)}
                            </p>
                            <div className="mt-4 flex items-center">
                                <div className="flex text-gray-700 text-sm mr-3">
                                    <svg onClick={(e) => newLike(e)} fill="none" viewBox="0 0 24 24"  className="w-4 h-4 mr-1 hover:fill-red-800" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                    </svg>
                                    <span>{likes_count}</span>
                                </div>
                                <div className="flex text-gray-700 text-sm mr-8">
                                    <svg fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-1" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
                                    </svg>
                                    <span>8</span>
                                </div>
                                <div className="flex text-gray-700 text-sm mr-4">
                                    <svg fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-1" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                                        </svg>
                                    <span>share</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Post
