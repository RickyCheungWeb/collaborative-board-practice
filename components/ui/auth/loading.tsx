import Image from 'next/image';
import logo from "../../../public/RickyLogo.svg";


type Props = {};

const Loading = (props: Props) => {
  return (
    <div className='h-full w-full flex flex-col gap-y-4 justify-center items-center'>
      <Image
        src={logo}
        alt='logo'
        width={120}
        height={120}
        className='animate-pulse duration-700'
      />
      <p>Loading...</p>
    </div>
  );
};

export default Loading;
