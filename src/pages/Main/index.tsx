import Setting from "../Setting";
import Article from "./Article";
import SimpleTargetWordsForm from "./SimpleTargetWordsForm";
import "./index.css";

const Main: React.FC = () => {
  return (
    <div className="main-container">
      <div className="flex w-full flex-wrap items-center pb-6">
        <h1 className="px-6 text-xl">名字錯字檢查</h1>
        <span>依照拼音搜尋文本中可能的專有名詞錯字</span>
      </div>
      <div className="card flex flex-row justify-between overflow-hidden rounded-box bg-base-300 px-8 py-4">
        <SimpleTargetWordsForm />
        <Setting />
      </div>
      <div className="divider"></div>
      <div className="card h-full overflow-hidden rounded-box bg-base-300 px-8 py-4">
        <Article />
      </div>
    </div>
  );
};

export default Main;
