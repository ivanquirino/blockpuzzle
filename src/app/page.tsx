import GameClient from "#/blockpuzzle/components/GameClient";
import WelcomeDialog from "#/blockpuzzle/components/WelcomeDialog";

function Page() {
  return (
    <div className="h-[100%] flex justify-center">
      <GameClient />
      <WelcomeDialog />
    </div>
  );
}

export default Page;
