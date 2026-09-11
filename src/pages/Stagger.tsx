import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Stagger = () => {

    useGSAP(() => {
        gsap.from(".box", {
            opacity: 0,
            duration: 2,
            stagger: 0.2,
        });
    });

    return (
        <div className="grid grid-cols-3 min-h-screen bg-black p-5 pt-[150px] gap-5 ">
            <div className="box w-full h-[600px] bg-white"></div>
            <div className="box w-full h-[600px] bg-white"></div>
            <div className="box w-full h-[600px] bg-white"></div>
            <div className="box w-full h-[600px] bg-white"></div>
            <div className="box w-full h-[600px] bg-white"></div>
            <div className="box w-full h-[600px] bg-white"></div>
            <div className="box w-full h-[600px] bg-white"></div>
            <div className="box w-full h-[600px] bg-white"></div>




        </div>
    );
};

export default Stagger;