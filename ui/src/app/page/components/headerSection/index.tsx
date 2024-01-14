import "./index.scss"

interface IPropsHeaderSection {
  text: string;
  children?: JSX.Element;
}

function HeaderSection({ ...props }: IPropsHeaderSection) {
  return (  
    <div className="common-headersection">
      {props.text}
      <div className="common-headersection-children">{props.children}</div>
    </div>
  );
}

export default HeaderSection;