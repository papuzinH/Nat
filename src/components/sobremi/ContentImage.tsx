const ContentImage = ({orientation, text, image, alt}: {orientation?: 'reverse'; text: React.ReactNode; image: string; alt: string;}) => {
    return (
        <div className={`flex justify-between items-center gap-8 h-fit mb-16 ${orientation === 'reverse' ? 'flex-row-reverse' : ''}`}>
            <div className="w-1/2 text-left flex flex-col gap-4 items-start justify-start text-lg">
                {text}
            </div>
            <div className="w-1/2 max-h-[28rem] overflow-hidden rounded-2xl shadow-2xl">
                <img src={image} alt={alt} style={{ objectPosition: '0 -100px' }}/>
            </div>
        </div>
    )
}

export default ContentImage;