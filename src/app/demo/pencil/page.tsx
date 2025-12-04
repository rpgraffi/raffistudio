import {
  PencilStroke,
  PencilUnderline,
} from "@/components/natural-ui/PencilStroke";
import { TextMarker } from "@/components/natural-ui/TextMarker";

export default function DemoPage() {
  return (
    <div className="min-h-screen p-20 bg-zinc-100 text-zinc-800 font-sans space-y-12">
      <h1 className="text-4xl font-bold">Natural UI Demo</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Dividers</h2>
        <p>Default Divider:</p>
        <PencilStroke width={300} as="div" />

        <p>Custom Color & Thickness:</p>
        <PencilStroke width={400} color="#e11d48" strokeWidth={4} as="div" />

        <p>High Deviation (Wobbly):</p>
        <PencilStroke width={300} deviation={5} as="div" />

        <p>Low Frequency (Smooth):</p>
        <PencilStroke width={300} frequency={0.02} deviation={5} as="div" />

        <p>Full Width Container (Flex):</p>
        <div className="w-full border border-dashed border-zinc-300 p-4">
          {/* Removed fixed width to allow dynamic resizing */}
          <PencilStroke as="div" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Underlines</h2>
        <p>
          Here is a{" "}
          <PencilUnderline href="#">
            link with a pencil underline
          </PencilUnderline>{" "}
          in a sentence.
        </p>
        <p>
          <PencilUnderline color="blue" deviation={10}>
            Custom Blue Underline hgvjfvzivizcvuzc
          </PencilUnderline>
        </p>
        <h3 className="text-xl">
          <PencilUnderline thickness={3} color="purple">
            Headline Underline
          </PencilUnderline>
        </h3>

        <div className="space-y-8 pt-8 border-t">
          <p className="text-sm">
            <span className="font-bold">Small text (text-sm):</span> <br />
            <PencilUnderline>
              The quick brown fox jumps over the lazy dog.
            </PencilUnderline>
          </p>
          <p className="text-base">
            <span className="font-bold">Base text (text-base):</span> <br />
            <PencilUnderline>
              The quick brown fox jumps over the lazy dog.
            </PencilUnderline>
          </p>
          <p className="text-2xl">
            <span className="font-bold">Large text (text-2xl):</span> <br />
            <PencilUnderline thickness={2}>
              The quick brown fox jumps over the lazy dog.
            </PencilUnderline>
          </p>
          <p className="text-5xl">
            <span className="font-bold">Huge text (text-5xl):</span> <br />
            <PencilUnderline thickness={4}>The quick brown fox</PencilUnderline>
          </p>
          <p className="text-4xl leading-none">
            <span className="font-bold">
              Tight leading (text-4xl leading-none):
            </span>{" "}
            <br />
            <PencilUnderline thickness={3}>The quick brown fox</PencilUnderline>
          </p>
          <p className="text-4xl leading-loose">
            <span className="font-bold">
              Loose leading (text-4xl leading-loose):
            </span>{" "}
            <br />
            <PencilUnderline thickness={3}>The quick brown fox</PencilUnderline>
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Text Markers</h2>
        <p className="text-lg leading-loose">
          This is a sentence where <TextMarker>some important text</TextMarker>{" "}
          is highlighted.
        </p>
        <p className="text-lg leading-loose">
          You can use <TextMarker color="#4ade80">different colors</TextMarker>{" "}
          like green or <TextMarker color="#f472b6">pink</TextMarker>.
        </p>
        <p className="text-lg leading-loose w-[300px]">
          It also works perfectly with{" "}
          <TextMarker>
            multiline text that wraps to the next line automatically
          </TextMarker>
          .
        </p>
        <p className="text-lg leading-loose">
          <TextMarker opacity={0.3} paddingY={0}>
            Subtle highlight
          </TextMarker>{" "}
          with adjustments.
        </p>
      </section>
    </div>
  );
}
