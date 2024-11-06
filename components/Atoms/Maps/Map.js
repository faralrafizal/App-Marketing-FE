import dynamic from "next/dynamic";

const Maps = dynamic(() => import("./index"), { ssr: false });

export default Maps;