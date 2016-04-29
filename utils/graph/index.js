#!/usr/bin/env node
var program = require('commander');
var fs = require('fs');
var path = require('path');


var walk = function (dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = dir + '/' + file;
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
};


program
    .arguments('<input-directory>')
    .option('-w, --write <filename>', 'The directory and filename to write to')
    .option('-f, --format <file-format>', 'The file format (default = gml)')
    .action(function (inputdir) {
        console.log('outputfile: %s outputformat: %s inputdir: %s',
            program.write, program.format, inputdir);

        var jsonOutput = {};
        var graph = jsonOutput.graph = {};
        graph.edges = [];
        graph.nodes = {};
        graph.comment = "Created on: " + new Date().toDateString();
        console.log(JSON.stringify(jsonOutput));

        walk(inputdir, function (err, results) {
            if (err) throw err;
            console.log(results);

            for (var i = 0; i < results.length; i++) {
                var file = results[i];
                console.log('Going to read: ' + results[i]);
                if (file.endsWith('package.json')) {
                    var packageObj = JSON.parse(fs.readFileSync(results[i], 'utf8'));
                    graph.nodes[packageObj.name] = {"type": "app"};

                    //add apps (is an object)
                    for (var dstApp in packageObj.deployment.appConnections) {
                        graph.nodes[dstApp] = {"type": "app"};
                        graph.edges.push({"src": packageObj.name, "dst": dstApp})
                    }

                    //add services (is an array)
                    packageObj.deployment.serviceBinding.forEach(function (dstService) {
                            graph.nodes[dstService] = {"type": "service"};
                            graph.edges.push({"src": packageObj.name, "dst": dstService})
                        }
                    );


                } else {
                    console.log('file is not a package');
                }
            }

            console.log(JSON.stringify(graph));

            // GML OUTPUT
            if (program.format === 'gml') {
                console.log('starting gml output...');


                // basic gml stuff
                var gml = 'graph [\n\tcomment ' + '"' + graph.comment + '"';

                // nodes

                var virtualNodeId = 0;
                for (var node in graph.nodes) {
                    virtualNodeId++;
                    graph.nodes[node].id = virtualNodeId;
                    var nodeTempl = `\n\tnode [\n\t\tid ${virtualNodeId}\n\t\tlabel "${node}"\n\t]`;
                    gml += nodeTempl;
                }

                //edges
                graph.edges.forEach(function (edge) {
                        var srcId = graph.nodes[edge.src].id;
                        var dstId = graph.nodes[edge.dst].id;

                        var edgeTempl = `\n\tedge [\n\t\tsource ${srcId}\n\t\ttarget ${dstId}\n\t]`;
                        gml += edgeTempl;
                    }
                );

                gml += "\n]";

                if (program.write) {
                    fs.writeFile(program.write, gml, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("The file " + program.write + " was saved!");
                    });
                } else {
                    console.log(gml);
                }


            }

            // JSON output
            if (program.format === 'json') {
                console.log('starting json output...');

                if (program.write) {
                    fs.writeFile(program.write, JSON.stringify(graph), function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("The file " + program.write + " was saved!");
                    });
                } else {
                    console.log(JSON.stringify(graph));
                }
            }

        });


    })
    .parse(process.argv);

