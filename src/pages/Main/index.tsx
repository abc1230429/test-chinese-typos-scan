import Article from "./Article";
import TargetWordsForm from "./TargetWordsForm";

const Main: React.FC = () => {
  return (
    <>
      <div className="flex h-full w-full flex-col">
        <div className="card flex rounded-box bg-base-300 px-8 py-4">
          <TargetWordsForm />
        </div>
        <div className="divider"></div>
        <div className="card flex flex-grow rounded-box bg-base-300 px-8 py-4">
          <Article />
        </div>
      </div>
    </>
  );
};

export default Main;
