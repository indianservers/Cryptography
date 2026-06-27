import { useEffect } from "react";
import { getModuleAnimationContent } from "../../data/moduleAnimationContent";
import { useAnimationSequence } from "../../hooks/useAnimationSequence";
import { AnimatedAlphabetMap } from "../visual/AnimatedAlphabetMap";
import { AnimatedByteGrid } from "../visual/AnimatedByteGrid";
import { AnimatedDistributionBars } from "../visual/AnimatedDistributionBars";
import { AnimatedFlowDiagram } from "../visual/AnimatedFlowDiagram";
import { AnimatedMatrixTransform } from "../visual/AnimatedMatrixTransform";
import { AnimatedNumberLineModulo } from "../visual/AnimatedNumberLineModulo";
import { AnimatedTreeBuild } from "../visual/AnimatedTreeBuild";
import { CurrentStepNarration } from "../visual/CurrentStepNarration";
import { StepPlaybackControls } from "../visual/StepPlaybackControls";

function activeIds(stepId: string, values: string[] = []) {
  if (!values.length) return [stepId];
  const index = Math.abs(Array.from(stepId).reduce((sum, char) => sum + char.charCodeAt(0), 0)) % values.length;
  return [values[index]];
}

export function ModuleAnimationSection({ route }: { route: string }) {
  const content = getModuleAnimationContent(route);
  const controls = useAnimationSequence(content?.sequence ?? { id: "empty", title: "", steps: [], reducedMotionSummary: "" });

  useEffect(() => {
    const replay = () => controls.replay();
    window.addEventListener("algorithm-replay", replay);
    return () => window.removeEventListener("algorithm-replay", replay);
  }, [controls]);

  if (!content || !controls.currentStep) return null;

  const mapping = content.visualMapping;
  const nodeIds = mapping.nodes?.map((node) => node.id) ?? [];
  const edgeIds = mapping.edges?.map((edge) => edge.id) ?? [];
  const cellIds = mapping.cells?.map((cell) => cell.id) ?? [];
  const treeIds = mapping.levels?.flatMap((level) => level.map((node) => node.id)) ?? [];
  const bars = mapping.bars ?? [];
  const activeBar = bars[controls.stepIndex % Math.max(1, bars.length)]?.id;

  return (
    <section className="mt-5 space-y-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm" aria-label={`${content.sequence.title} visual animation`}>
      <div>
        <div className="text-xs font-bold uppercase tracking-wide text-slate-600">Visual walkthrough</div>
        <h2 className="mt-1 text-xl font-bold text-slate-900">{content.sequence.title}</h2>
        <p className="mt-2 text-sm text-slate-600">{content.sequence.reducedMotionSummary}</p>
      </div>
      <CurrentStepNarration step={controls.currentStep} exactnessNote={content.sequence.exactnessNote} warning={content.safetyNote} reducedMotion={controls.prefersReducedMotion} />
      <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
        {content.animationType === "flow" && (
          <AnimatedFlowDiagram nodes={mapping.nodes ?? []} edges={mapping.edges ?? []} activeNodeIds={activeIds(controls.currentStep.id, nodeIds)} activeEdgeIds={activeIds(controls.currentStep.id, edgeIds)} reducedMotion={controls.prefersReducedMotion} />
        )}
        {content.animationType === "byte-grid" && (
          <AnimatedByteGrid cells={mapping.cells ?? []} activeCellIds={activeIds(controls.currentStep.id, cellIds)} chunkSize={mapping.chunkSize} caption={mapping.caption} />
        )}
        {content.animationType === "alphabet-map" && (
          <AnimatedAlphabetMap sourceAlphabet={mapping.sourceAlphabet ?? "ABCDEFGHIJKLMNOPQRSTUVWXYZ"} targetAlphabet={mapping.targetAlphabet ?? "ABCDEFGHIJKLMNOPQRSTUVWXYZ"} activeSourceIndex={controls.stepIndex % 26} activeTargetIndex={(controls.stepIndex + 3) % 26} mappings={mapping.mappings} />
        )}
        {content.animationType === "matrix" && (
          <AnimatedMatrixTransform inputMatrix={mapping.inputMatrix ?? [["input"]]} operationMatrix={mapping.operationMatrix} outputMatrix={mapping.outputMatrix ?? [["output"]]} activeCells={["input-0-0", "operation-0-0", "output-0-0"]} caption={mapping.caption} />
        )}
        {content.animationType === "tree" && (
          <AnimatedTreeBuild levels={mapping.levels ?? []} activeNodeIds={activeIds(controls.currentStep.id, treeIds)} activePairIds={activeIds(controls.currentStep.id, treeIds)} rootId={mapping.rootId} />
        )}
        {content.animationType === "modulo" && (
          <AnimatedNumberLineModulo modulus={mapping.modulus ?? 26} currentValue={(mapping.currentValue ?? 0) + controls.stepIndex} jumps={mapping.jumps ?? []} activeJump={0} operationLabel={mapping.caption ?? "Modulo wraparound"} />
        )}
        {content.animationType === "distribution" && (
          <AnimatedDistributionBars bars={bars} activeBar={activeBar} benchmarkLine={mapping.benchmarkLine} caption={mapping.caption} />
        )}
      </div>
      {controls.prefersReducedMotion && (
        <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-950">
          Reduced-motion mode is active. Use Previous and Next to step through the same explanation without autoplay.
        </div>
      )}
      <StepPlaybackControls
        stepIndex={controls.stepIndex}
        totalSteps={controls.totalSteps}
        playing={controls.playing}
        canPlay={controls.canPlay}
        onPrevious={controls.goPrevious}
        onNext={controls.goNext}
        onPlay={controls.play}
        onPause={controls.pause}
        onReset={controls.reset}
        onReplay={controls.replay}
      />
    </section>
  );
}
