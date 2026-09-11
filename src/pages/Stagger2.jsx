import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Stagger = () => {

    useGSAP(() => {
        gsap.from(".box", {
            opacity: 0,
            y: 100,
            ease: "bounce.out",
            duration: 1,
            stagger: 0.1,
        });
    });

    return (
        <div className=" min-h-screen bg-black p-5 pt-[150px] gap-5 w-full">
            <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full justify-center items-center ">
                <div className="box bg-white flex justify-center items-center p-6 w-[420px] max-h-[300px]">
                    <p>HOME</p>
                </div>

                <div className="box bg-white flex justify-center items-center p-6 w-[420px] max-h-[300px]">
                    <p>About Us</p>
                </div>

                <div className="box bg-white flex justify-center items-center p-6 w-[420px] max-h-[300px]">
                    <p>Contact Us</p>
                </div>

            </div>




        </div>
    );
};

export default Stagger;