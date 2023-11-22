interface ISCTable {
  layer: string;
  material: string;
  thickness: string;
}

const StructuralCompositionTable = ({ layer, material, thickness }: ISCTable) => {
  return (
    <>
      {layer} {material} {thickness}
    </>
  );
};

export default StructuralCompositionTable;
