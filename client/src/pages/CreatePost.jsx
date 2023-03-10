import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";

const CreatePost = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        prompt: "",
        photo: "",
    });
    const [generatingImg, setGeneratingImg] = useState(false);
    const [loading, setLoading] = useState(false);

    const generateImage = async () => {
        // This calls OUR backend
        // If we typed something into the prompt input >
        if (form.prompt) {
            try {
                // Set the loading indicator on the image to TRUE > shows indicator
                setGeneratingImg(true);
                // Call our API > POST method
                const response = await fetch("http://localhost:8080/api/v1/dalle", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ prompt: form.prompt }),
                });

                const data = await response.json();
                setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
            } catch (error) {
                alert(error);
            } finally {
                setGeneratingImg(false);
            }
        } else {
            alert("Please enter a prompt");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Browser wont reload our app automatically

        if (form.prompt && form.photo) {
            setLoading(true);

            try {
                const response = await fetch("http://localhost:8080/api/v1/posts", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(form),
                });

                await response.json();
                navigate("/");
            } catch (error) {
                alert(error);
            } finally {
                setLoading(false);
            }
        } else {
            alert("Please eneter a prompt and generate a image");
        }
    };

    const handleChange = (e) => {
        const name = e.target.name;
        // Square brackets [] are used to dynamically update object property
        setForm({ ...form, [name]: e.target.value });
        // Or we can use []
        // setForm({...form, [e.target.name]: e.target.value})
    };

    const handleSurpriseMe = () => {
        const randomPrompt = getRandomPrompt(form.prompt);
        setForm({ ...form, prompt: randomPrompt });
    };

    return (
        <section className="max-w-7xl mx-auto">
            <div>
                <h1 className="font-extrabold text-gray-800 text-3xl">Create Post</h1>
                <p className="mt-2 text-gray-500 text-md max-w-[500px]">
                    Create imaginative and visually stunning images generated by DALL-E AI and share
                    them with community.
                </p>
            </div>

            <form className="mt-16 max-w-3xl" onSubmit={handleSubmit} action="">
                <div className="flex flex-col gap-5">
                    <FormField
                        labelName="Your name"
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={form.name}
                        handleChange={handleChange}
                    />

                    <FormField
                        labelName="Prompt"
                        type="text"
                        name="prompt"
                        placeholder="A plush toy robot sitting against a yellow wall"
                        value={form.prompt}
                        handleChange={handleChange}
                        isSurpriseMe
                        handleSurpriseMe={handleSurpriseMe}
                    />

                    <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
                        {form.photo ? (
                            <img
                                src={form.photo}
                                alt={form.prompt}
                                className={"w-full h-full object-contain"}
                            />
                        ) : (
                            <img
                                src={preview}
                                alt="preview"
                                className="w-8/12 object-contain opacity-40"
                            />
                        )}

                        {generatingImg && (
                            <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.7)] rounded-lg">
                                <Loader />
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-5 flex gap-5">
                    <button
                        type="button"
                        onClick={generateImage}
                        className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-64  px-5 py-2.5 text-center"
                    >
                        {generatingImg ? "Generating..." : "Generate"}
                    </button>
                </div>

                <div className="mt-10">
                    <p className=" text-gray-500 text-base">
                        Once you have created the image you want, you can share it with others in
                        the community!
                    </p>
                    <button
                        type="submit"
                        className="mt-3 text-white bg-[#4649ff] font-medium 
                        rounded-md text-sm w-full sm:w-64 px-5 py-2.5 text- center"
                        onClick={handleSubmit}
                    >
                        {loading ? "Sharing..." : "Share with the community"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default CreatePost;
