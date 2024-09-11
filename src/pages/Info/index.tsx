import { useRef } from "react";
import { InformationCircle } from "src/icons";

const Info = () => {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        className="btn btn-ghost btn-sm ml-1 px-1"
        onClick={() => ref.current?.showModal()}
      >
        <InformationCircle />
      </button>
      <dialog
        ref={ref}
        style={{ scrollbarGutter: "stable" }}
        className="modal "
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">說明</h3>
          <p className="py-4 [&>p]:mt-2 [&_b]:mx-1">
            <p>依照拼音搜尋文章中可能的選字錯誤。</p>
            <br />
            <p>
              例如，欲比對名字「愛麗絲」與「鮑伯」，針對文章「艾莉斯傳送一條訊息給包伯」，可以找到選字錯誤：「艾莉斯」、「包伯」。
            </p>
            <p>
              支援模糊比對，例如「愛莉蘇」可能被認為是「愛麗絲」的錯字。在
              <b>更多設定</b>中，<b>閥值</b>
              設定越高，比對越寬鬆，但至少要有一個字相同。此外，設定為
              <b>指定非錯字</b>的詞，將不被視為錯字。
            </p>
            <br />
            <p>拼音資料來自全字庫，且只支援繁體中文。</p>
            <p>
              所有計算都在使用者瀏覽器中完成，過程中不會傳輸任何資料，請安心使用。
            </p>
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">關閉</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Info;
