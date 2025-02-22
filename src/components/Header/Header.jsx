import s from "./Header.module.sass";

export default function Header() {
  return (
    <div className={s.container}>
      <h4 className={s.path}>
        Home<span>/ ...</span>
      </h4>
      <img src="/images/icons/lupa.svg" alt="" />
    </div>
  );
}
