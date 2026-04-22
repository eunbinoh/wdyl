import Image from "next/image";

type Props = {
  itemIds: string[];
};

export function PreloadImages({ itemIds }: Props) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        overflow: "hidden",
        pointerEvents: "none",
        opacity: 0,
      }}
    >
      {itemIds.map((id) => (
        <Image
          key={id}
          src={`/items_img/${id.replace(/_/g, "")}.jpg`}
          alt=""
          width={300}
          height={300}
          sizes="(max-width: 560px) 45vw, 250px"
        />
      ))}
    </div>
  );
}
