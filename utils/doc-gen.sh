for schema in ../schemas/*
do
	manifest_name="$( basename ${schema} | tr '-' '_' | cut -d'.' -f1 ).md"
	node ./doc-gen/index.js ${schema} > ../docs/${manifest_name}
done
