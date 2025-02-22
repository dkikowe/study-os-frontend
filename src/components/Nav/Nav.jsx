import s from "./Nav.module.sass";

export default function Nav() {
  return (
    <>
      {/* Десктопное меню */}
      <div className={s.desktopNav}>
        <img src="/images/icons/brainNav.svg" className={s.brain} alt="" />
        <div className={s.navBar}>
          <img src="/images/icons/avatar.svg" className={s.avatar} alt="" />
          <img src="/images/icons/Line.svg" className={s.line} alt="" />
          <img src="/images/icons/Home.svg" className={s.home} alt="" />
          <img src="/images/icons/AI.svg" className={s.ai} alt="" />
          <img src="/images/icons/Biology.svg" className={s.bio} alt="" />
          <img src="/images/icons/Math.svg" className={s.math} alt="" />
          <img src="/images/icons/Languages.svg" className={s.lang} alt="" />
          <img src="/images/icons/Line.svg" className={s.line} alt="" />
          <img src="/images/icons/Notes.svg" className={s.notes} alt="" />
          <img src="/images/icons/Tags.svg" className={s.tags} alt="" />
        </div>
      </div>

      {/* Мобильное меню */}
      <div className={s.mobileNav}>
        <img src="/images/icons/homeMobile.svg" alt="Home" />
        <img src="/images/icons/spheres.svg" className={s.spheres} alt="" />
        <img src="/images/icons/more.svg" alt="" />
        <img src="/images/icons/reshetka.svg" alt="" />
      </div>
    </>
  );
}
