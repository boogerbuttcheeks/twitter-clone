import React, { Component } from "react";
import { auth, db } from '../firebase/firebase.config';
import { useState } from "react";
import { collection, doc, addDoc, getDocs, postDoc, getDoc, deleteField, deleteDoc, Firestore, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";


//components
export const PostContent = styled.div`
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

export const PostBody = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 10px;
`;

export const UserName = styled.div`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
`;

export const PostHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

export const PostDisplay = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin: auto;
`;

export const DefaultButton = styled.button`
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

export const PageHeader = styled.div`
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
position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    z-index: 100;
    background: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

const ReportDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 10px;
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

    const handleFollow = async (user) => {
        await addDoc(collection(db, "followers"), {
            follow: user,
            userId: auth.currentUser.email,
        });
        setFollowing(true)
        console.log('followed')
    }

    const handleUnfollow = async (user) => {
        await addDoc(collection(db, "followers"), {
            //i wanted to use deleteDoc but it wasnt working
            unfollow: user,
            userId: auth.currentUser.email,
        });
        setFollowing(false)
        console.log('unfollowed')
    }

    // end of handle following

    // handle edit 

    const [edit, setEdit] = useState(false)
    const [NewTweet, setNewTweet] = useState('')

    const handleEdit = async () => {
        console.log('edit')
        setEdit(true)
    }

    const SumbitEdit = async () => {  
        const docRef = doc(db, "posts", postId);

    const EditedTweet = {
        text: NewTweet,
        oldText: tweet,
        user: auth.currentUser.email,
        userId: auth.currentUser.uid,
        EditedAt: new Date()
    }

    updateDoc(docRef, EditedTweet)
    .then(docRef => {
        console.log("Your tweet has been edited");
        showTweet();
        setNewTweet('');
        setEdit(false)
    })
    .catch(error => {
        console.log(error);
    });      
    }
    

    // end of handle edit

    // handle report tweet

    const [form, setForm] = useState(false)
    const [message, setMessage] = useState('')
    // grabbing the tweet Id from the onClick
    const [postId, setPostId] = useState('')

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
            tweetId: postId,
            ReportedAt: new Date()
        });
        alert('report succesfully sent')
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
                                <ReportDiv>
                                <DefaultButton onClick={() => setForm(false)}>x</DefaultButton>
                                <label>Whats your reason for reporting?</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                                <DefaultButton onClick={sendReport}>Next</DefaultButton>
                                </ReportDiv>
                            </ReportPopup>
                        </>) : null
                }
                { edit ? (
                    <>
                        <ReportPopup>
                            <ReportDiv>
                                <DefaultButton onClick={() => {setEdit(false); setNewTweet('')}}>x</DefaultButton>
                                <label>Edit your tweet</label>
                                <textarea
                                    placeholder={NewTweet}
                                    value={NewTweet}
                                    onChange={(e) => setNewTweet(e.target.value)}
                                ></textarea>
                                <DefaultButton onClick={SumbitEdit}>Next</DefaultButton>
                            </ReportDiv>
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
                                    {following ? <DefaultButton onClick={(e) => handleUnfollow(e, tweet.user)}>Unfollow</DefaultButton> : <DefaultButton onClick={() => handleFollow(tweet.user)}>Follow</DefaultButton>}
                                    {/* <DefaultButton onClick={()=> handleFollow()}>{followText}</DefaultButton> */}
                                    <DefaultButton onClick={() => {handleEdit(); setPostId(tweet.id); setNewTweet(tweet.text)}}>Edit</DefaultButton>
                                    <DefaultButton onClick={() => { handleReport(); setPostId(tweet.id);}}>Report</DefaultButton>
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