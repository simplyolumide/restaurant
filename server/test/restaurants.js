const chai = require("chai");
const chaiHttp = require("chai-http");
let server = require("../server");

//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Restaurants API', () => { 

    describe("GET /api/v1/restaurants", () => {
        it("It should GET all the restaurants", (done) => {
            chai.request('http://localhost:5000')
                .get("/api/v1/restaurants")
                .end((err, response) => {
                    response.should.have.status(200);
                    //   response.body.should.be.a('array');
                    //response.body.length.should.be.eq(3);
                done();
                })
        }).timeout(10000);

    })

    describe("GET /api/v1/restaurants/:id", () => {
        it("It should GET a restaurant", (done) => {
            chai.request('http://localhost:5000')
                .get("/api/v1/restaurants/1")
                .end((err, response) => {
                    response.should.have.status(200);
                    //response.body.should.have.property('restaurant');
                    //response.body.should.have.property('reviews');
                    response.body.should.be.a('object');
                    //response.body.length.should.be.eq(3);
                done();
                })
        }).timeout(10000);


        it("It should not GET a restaurant", (done) => {
            chai.request('http://localhost:5000')
                .get("/api/v1/restaurants/a")
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.error.should.be.a('object');
                done();
                })
        }).timeout(10000);

    })


});
