import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
}

const WorkImage = (props: Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [video, setVideo] = useState("");

  const getAssetUrl = (assetPath: string) => {
    if (!assetPath) return "";
    if (/^https?:\/\//i.test(assetPath)) return assetPath;
    return `${import.meta.env.BASE_URL}${assetPath.replace(/^\/+/, "")}`;
  };

  const fallbackImage = `${import.meta.env.BASE_URL}images/placeholder.webp`;
  const imageSrc = getAssetUrl(props.image) || fallbackImage;

  const handleMouseEnter = async () => {
    if (props.video) {
      const videoSrc = getAssetUrl(props.video);
      if (!videoSrc) return;

      try {
        setIsVideo(true);
        const response = await fetch(videoSrc);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setVideo(blobUrl);
      } catch {
        setIsVideo(false);
      }
    }
  };

  return (
    <div className="work-image">
      <a
        className="work-image-in"
        href={props.link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVideo(false)}
        target="_blank"
        data-cursor={"disable"}
      >
        {props.link && (
          <div className="work-link">
            <MdArrowOutward />
          </div>
        )}
        <img
          src={imageSrc}
          alt={props.alt}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== fallbackImage) {
              target.src = fallbackImage;
            }
          }}
        />
        {isVideo && <video src={video} autoPlay muted playsInline loop></video>}
      </a>
    </div>
  );
};

export default WorkImage;
