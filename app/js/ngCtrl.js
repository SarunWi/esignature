angular.module('drawingApp', [])
    .controller('drawingController', ['$q', 'HttpFactory','$scope', function($q, HttpFactory,scope) {
        var ctrl = this;

        ctrl.pdfComponent = [];
        ctrl.option = {
                        scale       :1.5, 
                        line_width  : 1,
                        line_color  : '#000'
                        }

        ctrl.pdfProperty = {
            maxPage         : 0,
            currentPage     : 0,
            pdfObj          : undefined
        };
        
        ctrl.savePage = function(){
            var pageArray = [ctrl.canvas,ctrl.canvasTmp];
            ctrl.createPDFDoc(pageArray);
        }
        ctrl.changePage = function(pageNo){
            ctrl.pdfProperty.currentPage = pageNo;
        }
        
        ctrl.getFile = function() {
            HttpFactory.get_file().then(function(result) {
                var pdfData = atob(result.data);

                PDFJS.workerSrc = '/lib/js/build/pdf.worker.js';
                
                var loadingTask = PDFJS.getDocument({ data: pdfData });
                
                loadingTask.promise.then(function(pdf) {
                    ctrl.pdfProperty.currentPage = 1;
                    ctrl.pdfProperty.maxPage 	 = pdf.pdfInfo.numPages;
                    ctrl.pdfProperty.pdfObj 	 = pdf;

                    ctrl.initComponent(ctrl.option, pdf).then(function(result){
                        // do something
                        console.log(result);
                    })
                   
                    
                }, function(reason) {
                    console.error(reason);
                });

            })
        }

        ctrl.initComponent = function( option, pdfObj ){
            var deferred = $q.defer();
            var templateId = 'pdfPainting';            
            for(var i=0;i<pdfObj.pdfInfo.numPages;i++){
                var pdfComp = {  
                            componentid     : templateId+(i+1),
                            option          : option ,
                            pdfobj          : pdfObj,
                            pagenumb        : i+1,
                            testback        : undefined
                        }
                ctrl.pdfComponent.push(pdfComp);
            }
            deferred.resolve(ctrl.pdfComponent);
            return deferred.promise;
        }

        ctrl.createPDFDoc = function(){
            var doc;
            var position = 0;
            var imgArray = [];
            var canvas; 
            var context;
            for(var i=0;i<ctrl.pdfComponent.length;i++){
                if(doc){
                    doc.addPage(210 ,297);
                    position += 297;
                }else{
                    doc = new jsPDF('p', 'mm');
                }
                var canv    = document.getElementById(ctrl.pdfComponent[i].componentid+'canvas');
                if(canvas==undefined){
                    canvas = document.createElement('canvas');
                    document.body.appendChild(canvas);
                    canvas.width = 892.92;
                    canvas.height =1262.82*ctrl.pdfComponent.length;
                    context = canvas.getContext('2d');
                }
                context.drawImage(document.getElementById(ctrl.pdfComponent[i].componentid+'canvas'),0,1262*i,892,1262);
            }
            var imgData = canvas.toDataURL('image/png');
            document.body.removeChild(canvas);

            var imgWidth = 210; 
            var pageHeight = 295;  
            var imgHeight = canvas.height * imgWidth / canvas.width;
            var heightLeft = imgHeight;

            var doc = new jsPDF('p', 'mm');
            var position = 0;

            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 10) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            doc.save('testFile.pdf');
        }


        ctrl.getFile();
    }])