import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Text = () => {

    useGSAP(() => {
        const box = document.querySelector(".box");
        const parent = box.parentElement;

        gsap.to(box, {
            x: parent.offsetWidth - box.offsetWidth,
            duration: 2,
            rotation: 360,
            borderRadius: 200,
            scale: 2,
            repeat: -1,
            yoyo: true,
            backgroundColor: "red",
            ease: "power1.inOut"
        });
    })

    return (
        <div className="flex items-center min-h-screen bg-black">
            <div className="box w-[300px] h-[300px] bg-white"></div>
        </div >
    );
};

export default Text;