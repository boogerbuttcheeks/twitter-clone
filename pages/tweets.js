import React, { Component } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from '../firebase/firebase.config';
import { useState } from "react";
import { Firestore, getDocs } from "firebase/firestore";
import { collection, doc, addDoc, postDoc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";


//components
const PostContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    padding: 20px;
    max-width: 600px;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    margin: 20px 20px;
`;

const PostBody = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 10px;
`;

const UserName = styled.div`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const PostHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

const PostDisplay = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin: auto;
`;

const DefaultButton = styled.button`
    background-color: #1da1f2;
    border: none;
    color: black;
    padding: 5px 12px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 5px;
`;

const PageHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 600px;
    margin: auto;
    margin-bottom: 40px;
    margin-top: 40px;
`;

// report Compononet

const ReportPopup = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    padding: 20px;
    max-width: 600px;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    margin: 20px 20px;
`;


// end of Components 

export default function Tweets() {

    const router = useRouter();
    const handleClick = (e) => {
        router.back('./')
    }


    useEffect(() => {
        showTweet()
    }, [])

    // handle tweets

    const [user, setUser] = useState({})
    const [tweet, setTweet] = useState('')
    const [viewTweet, showNewTweet] = useState([])

    const handleSubmit = event => {
        event.preventDefault()
        event.target.reset()
    }

    const createTweet = async () => {
        const postDoc = await addDoc(collection(db, "posts"), {
            text: tweet,
            user: auth.currentUser.email,
            userId: auth.currentUser.uid
        });
        // console.log('u suckkkk')
        showTweet();
    }

    const showTweet = async () => {
        const getDoc = await getDocs(collection(db, "posts"));
        var newTweets = [];
        getDoc.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
            newTweets.push({ ...doc.data(), id: doc.id })
        });
        showNewTweet([...newTweets]);
        console.log(viewTweet);
    }
    //end of handle tweets

    // Handle following

    const [following, setFollowing] = useState(false)

    const handleFollow = async () => {
        const postDoc = await addDoc(collection(db, "follow"), {
            follow: follow,
            user: auth.currentUser.email,
            userId: auth.currentUser.uid
        });
        setFollowing(true)
        console.log('followed')
    }

    const handleUnfollow = async () => {
        const postDoc = await addDoc(collection(db, "unfollow"), {
            unfollow: follow,
            user: auth.currentUser.email,
            userId: auth.currentUser.uid
        });
        setFollowing(false)
        console.log('unfollowed')
    }

    // end of handle following

    // handle edit 

    const handleEdit = async () => {
        console.log('edit post')
    }

    // end of handle edit

    // handle report tweet

    const [form, setForm] = useState(false)
    const [message, setMessage] = useState('')

    // showing the form in the UI
    const handleReport = async () => {
        console.log('report post')
        setForm(true)
    }

    // sending the report
    const sendReport = async () => {
        const SubmitForm = await addDoc(collection(db, "report"), {
            message: message,
            user: auth.currentUser.email,
            userId: auth.currentUser.uid,
        });
        setForm(false)
        console.log('report sent')
    }

    // end of handle report tweet

    return (
        <div>
            {/* Creating a new tweet */}
            <PageHeader>
                <button onClick={() => handleClick()}>home</button>
                <div>
                    <form onSubmit={handleSubmit}>

                        {/* helppp can someone make the user name/email show like on the home page when logged in pls */}

                        <div>{tweet.user}</div>
                        <input
                            placeholder="What's happening?"
                            type="text"
                            onChange={(event) => {
                                setTweet(event.target.value)
                            }}
                        />
                        <button onClick={createTweet}>Tweet</button>
                    </form>
                </div>
            </PageHeader>
            {/* show tweets */}

            <PostDisplay>
                {/* report form popup */}
                {
                    form ? (
                        <>
                            <ReportPopup>
                                <DefaultButton onClick={() => setForm(false)}>x</DefaultButton>
                                <label>What's your reason for reporting?</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                                <DefaultButton onClick={sendReport}>Next</DefaultButton>
                            </ReportPopup>
                        </>) : null
                }
                {/* <button onClick={()=>showTweet()}>test button</button> */}
                {viewTweet.map(tweet => {
                    return (
                        <PostContent key={tweet.id}>
                            <PostHeader>
                                <UserName>
                                    {tweet.user}
                                </UserName>
                                <div>
                                    {following ? <DefaultButton onClick={() => handleUnfollow()}>Unfollow</DefaultButton> : <DefaultButton onClick={() => handleFollow()}>Follow</DefaultButton>}
                                    {/* <DefaultButton onClick={()=> handleFollow()}>{followText}</DefaultButton> */}
                                    <DefaultButton onClick={() => handleEdit()}>Edit</DefaultButton>
                                    <DefaultButton onClick={() => handleReport()}>Report</DefaultButton>
                                </div>
                            </PostHeader>
                            <PostBody> {tweet.text}</PostBody>
                        </PostContent>
                    )
                })}
            </PostDisplay>
        </div>
    )
}