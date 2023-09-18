import Image from 'next/image'

import { Metadata } from "next";
import GameClient from "#/blockpuzzle/components/GameClient";

function Page() {
  return (
    <div className="h-[100%] flex justify-center items-center">
      <GameClient />
    </div>
  );
}

export default Page;
