import { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "../Upload/Upload.jsx";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini.js";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const [img, setImg] = useState({
    isLoading: false,
    error: false,
    dbData: {},
    aiData: {},
  });
  const endRef = useRef(null);

  const chat = model.startChat({
    history:
      data?.history?.map(({ role, parts }) => ({
        role,
        parts: [{ text: parts[0].text }],
      })) || [],
  });

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [question, answer, img]);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${data._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question.length ? question : undefined,
            answer: answer.length ? answer : undefined,
            img: img.dbData?.filePath || undefined,
          }),
        }
      ).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();
          setQuestion("");
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const add = async (param, isInitial) => {
    if (!isInitial) setQuestion(param);
    // setQuestion(param);
    try {
      const prompt = param;
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, prompt] : [prompt]
      );
      // const response = await result.response;
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }
      mutation.mutate();
      // setImg({ isLoading: false, error: false, dbData: {}, aiData: {} });
    } catch (error) {
      console.log(error);
    }
  };
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    await add(text, false);
    inputRef.current.value = "";
  };
  return (
    <>
      {/* ADD NEW CHAT */}
      {img.isLoading && <Skeleton />}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className="message user">{question}</div>}
      {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} />
        <input  id="file" type="file" multiple={false} hidden />
        <input  type="text" name="text" placeholder="Ask anything..." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
