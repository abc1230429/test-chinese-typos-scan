import Setting from "../Setting";
import Article from "./Article";
import SimpleTargetWordsForm from "./SimpleTargetWordsForm";

const Main: React.FC = () => {
  return (
    <div className="mx-auto grid h-svh max-w-4xl grid-rows-[auto_auto_auto_1fr] p-2 pt-4 sm:p-8 lg:max-w-7xl">
      <div className="flex w-full flex-wrap items-center pb-4">
        <h1 className="px-6 text-xl">名字錯字檢查</h1>
        <span className="pl-6 sm:pl-0">
          依照拼音搜尋文本中可能的專有名詞錯字
        </span>
      </div>
      <div className="card flex flex-row flex-wrap justify-between gap-3 overflow-hidden rounded-box bg-base-300 p-4 sm:gap-0  sm:px-8">
        <SimpleTargetWordsForm />
        <Setting />
      </div>
      <div className="divider my-1 sm:my-3"></div>
      <div className="card flex overflow-auto rounded-box bg-base-300 p-4 sm:px-8">
        <Article />
      </div>
    </div>
  );
};

export default Main;
