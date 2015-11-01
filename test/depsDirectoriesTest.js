should = require('should')

DepsParser = require('../lib/DepsParser.js')

SAMPLE_PACKAGE_JSON = './test/sample_project/package.json'

describe("DepsParser", function(){
    parser = DepsParser()
    
    verifyDirectories = function(directories, expectedDirs, excludedProperties){
        expectedDirs = expectedDirs ? expectedDirs : ['include', 'lib', 'src'];
        directories.should.be.Object;
        directories.should.have.properties(expectedDirs);
        
        if(excludedProperties){
            directories.should.not.have.properties(excludedProperties)
        }
    }
    
    describe('#extractDirs', function(){
        it("should inspect a package json for c++ includes and libs directories", function(done){
            parser.extractDirs(SAMPLE_PACKAGE_JSON, function(err, directories){
                verifyDirectories(directories);
                done();
            });
        });
    });
    
    describe('#parse', function(){
        it("should inspect a package json for some project on a given directory",function(done){
            PROJECT_NAME = 'sample_project'
            OPTIONAL_DIR = './test'
            parser.parse(PROJECT_NAME, OPTIONAL_DIR, function(err, dirs){
                verifyDirectories(dirs);
                done();
            });
        });
        
        it("should inspect the package json of some project on the 'node_modules' dir by default",function(done){
            parser.parse('mocha', function(err, dirs){
                dirs.should.be.Object;
                done();
            });
        });
        
        it("should recognize directory conventions when not found on package.json",function(done){
            parser.parse('conventions_and_json', './test', function(err, dirs){
                verifyDirectories(dirs, {'include' : 'real_include', 'src' : 'src'}, ['lib']);
                done();
            });
        });
        
        it("should recognize directory conventions even in absence of package.json",function(done){
            parser.parse('conventions', './test', function(err, dirs){
                verifyDirectories(dirs, {'include' : 'include', 'src' : 'src', 'lib' : 'lib'});
                done();
            });
        });
    });
});