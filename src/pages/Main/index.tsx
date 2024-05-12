import Article from "./Article";
import TargetWordsForm from "./TargetWordsForm";
import "./index.css";

const Main: React.FC = () => {
  return (
    <div className="main-container">
      <div className="card flex rounded-box bg-base-300 px-8 py-4">
        <TargetWordsForm />
      </div>
      <div className="divider"></div>
      <div className="card h-full rounded-box bg-base-300 px-8 py-4">
        <Article />
      </div>
    </div>
  );
};

export default Main;
