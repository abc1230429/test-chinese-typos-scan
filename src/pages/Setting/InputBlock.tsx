const InputBlock: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div className="card grid h-full flex-grow rounded-box bg-base-300 p-8">
      <input
        type="text"
        placeholder={label}
        className="input input-bordered w-full"
      />
    </div>
  );
};

export default InputBlock;
