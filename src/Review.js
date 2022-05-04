import React, { useEffect, useState } from "react";
import defaultAvatar from "./assets/defaultUserAvatar.png";
import { Avatar, Form, Input, Button, Rate}  from "antd";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import moment from 'moment';

export default function Review({
    review,
    index,
    loginUsername,
    updateReview,
    selectedEditReviewId,
    setSelectedEditReviewId,
    setSelectedDeleteReviewId,
    setDeleteModalVisible,
}) {
    
    const [reviewEditForm] = Form.useForm();
    const [newReviewInput, setNewReviewInput] = useState(review);
    console.log('Review ' + index + ' rendered. review: ' , review, "newReviewInput: ", newReviewInput);

    
    useEffect(()=>{
        setNewReviewInput(review);
        reviewEditForm.setFieldsValue({
            content: review.content,
            rating: review.rating
        })}, [review])  // VERY IMPORTANT!! 
    // Without this useEffect, "newReviewInput" won't be updated to the new review.
    // Scenario: After updating or deleting a review,
    // the order of reviews array changed. 
    // By calling getAllReviewsForEntry() in updateReview and deleteReview functions (in ReviewArea.jsx),
    // the state "reviews" array in ReviewArea gets updated, and therefore when 
    // rendering the list of <Review> components, a new review props is passed into each <Review> and the new review gets rendered.
    // But newReviewInput remains the original value, so if we click "edit" button, and then directly click "Update" 
    // without doing anything to the input area, the submitted value will be the original "newReviewInput",
    // instead of the newly passed-in review, which is wrong.


    return (
        <div >
            <div>
                <Avatar size="large" src={/**TODO: get creator's avatar.Try using 'ref' in schema?>*/ defaultAvatar}/>
                <span><b>{review.creator}</b></span>
                {review._id !== selectedEditReviewId && (
                    <span>
                        <Rate disabled allowHalf value={review.rating}/>
                        Last Edited: {moment(review.updatedAt).format('MMMM Do YYYY, h:mm a')}
                    </span>
                    
                    
                )}
            </div>

            <div>
                {review._id === selectedEditReviewId ? (
                    <Form form={reviewEditForm} initialValues={{
                        content: review.content,
                        rating: review.rating}}>
                        <Form.Item label="Content" name="content"
                            rules={[
                                {
                                required: true,
                                whitespace: true,
                                message: 'Please enter your review content!',
                                },
                            ]}>
                            <Input.TextArea onChange={e => {
                                setNewReviewInput({...newReviewInput, content: e.target.value});
                                console.log("setNewReviewInput called");
                                }}/>
                        </Form.Item>

                        <Form.Item label="Rating" name="rating"
                            rules={[
                                {
                                required: true,
                                message: 'Please select your rating!',
                                },
                            ]}>
                            <Rate allowHalf onChange={value => {
                                setNewReviewInput({...newReviewInput, rating: value});
                            }}/>
                        </Form.Item>


                        <Form.Item>
                            <Button htmlType="submit" type="primary" onClick={()=>{
                                updateReview(review._id, newReviewInput)
                            }}>Update Review</Button>
                            <Button htmlType="button" onClick={()=>{
                                setSelectedEditReviewId(null)
                            }}>Cancel</Button>
                        </Form.Item>
                    </Form>
                ) :  (
                    review.content
                )}
            </div>

            <div>
                {review._id !== selectedEditReviewId && (
                    <>
                        {review.creator === loginUsername && (
                            <div>
                                <EditTwoTone onClick={()=>{
                                    setSelectedEditReviewId(review._id);
                                }}/>
                                <DeleteTwoTone twoToneColor="red" onClick={()=>{
                                    setSelectedDeleteReviewId(review._id);
                                    setDeleteModalVisible(true);
                                }}/>
                            </div>
                        )}
                        
                    
                    </>

                )}
            </div>

        </div>



    )
 

}