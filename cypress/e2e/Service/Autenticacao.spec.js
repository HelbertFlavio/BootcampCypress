/// <reference types="cypress" />

import auth from '../../fixtures/auth.json'

describe('Testes de Autenticação', () => {
    let token

    beforeEach(() => {
        cy.tokenJwt().then((auth) => {
            token = auth
        })
    });


    it('[POST] - Autenticando na API', () => {
        cy.request({
            method: 'POST',
            url: 'api/auth',
            body: auth
            // failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
            // expect(response.body.errors[0].msg).to.eq("Credenciais inválidas")
            expect(response.body).to.be.not.empty
            expect(response.body).to.have.property('jwt')
            expect(response).to.have.property('headers')
            expect(response).to.have.property('duration')
            console.log(response.body);
            cy.log(response.body)
            cy.getCookies('conexaoqa.herokuapp.com').should('exist')
        })
    })

    it('[GET] - Verificar Usuário Logado com variavel tempo de execução', () => {
        let token2
        cy.tokenJwt().then((auth) => {
            token2 = auth
        })
        cy.request({
            method: 'GET',
            url: 'api/auth',
            headers: {
                Cookies: token2
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            console.log(response.body);
            cy.log(response.body)
        })
    })

    it('[GET] - Verificar Usuário Logado com variavel Global', () => {

        cy.request({
            method: 'GET',
            url: 'api/auth',
            headers: {
                Cookies: token
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            console.log(response.body);
            cy.log(response.body)
        })
    })
});

describe('Testes de Postagens', () => {
    let token

    beforeEach(() => {
        cy.tokenJwt().then((auth) => {
            token = auth
        })
    });

    it('Consultar Postagens', () => {
        cy.request({
            method: 'GET',
            url: 'api/posts',
            headers: {
                Cookies: auth
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.not.empty
            expect(response).to.have.property('headers')
            // expect(response.body).to.contains("TesteHelbert")
            // expect(response.body[0].text).to.eq("Teste de postagem")
            // expect(response.body[0].user).to.eq("62ff6b429b6552001528dcda")
            console.log(response.body);
        })
    });

    it('Consultar Postagens por ID', () => {
        cy.request({
            method: 'GET',
            url: 'api/posts/6316ab72bcdebf0015b7cf3f',
            headers: {
                Cookies: auth
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.not.empty
            expect(response).to.have.property('headers')
            expect(response.body.name).to.eq("TesteHelbert")
            expect(response.body.text).to.eq("Teste de postagem")
            console.log(response.body);
        })
    });

    it('[POST] - Criar Postagem', () => {
        cy.request({
            method: 'POST',
            url: 'api/posts',
            body: {
                text: "BootCamp000"
            },
            headers: {
                Cookies: auth
            }
        }).then((response) => {
            expect(response.status).to.eq(201)
            expect(response.body).to.be.not.empty
            expect(response).to.have.property('headers')
            expect(response.body.name).to.eq("TesteHelbert")
            expect(response.body.text).to.eq("BootCamp000")
            console.log(response.body);
        })
    });

    it('[PUT] - Curtir Postagem', () => {
        cy.request({
            method: 'PUT',
            url: 'api/posts/like/63172e75e3f7ef001547668a',
            headers: {
                Cookies: auth
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.not.empty
            expect(response).to.have.property('headers')
            console.log(response.body);
        })
    });


    it('teste', () => {
        let idteste
        cy.criarPostagem().then((response) => {
            idteste = response.body
        })
        console.log(idteste);
    });

    it.only('[DELETAR] - Deletar Postagem', () => {

        cy.criarPostagem().then((response) => {
            let id = response.body._id


            cy.request({
                method: 'DELETE',
                // url: `api/posts/63172f12e3f7ef0015476692`,
                url: `api/posts/${id}`,
                headers: {
                    Cookies: auth
                }
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.not.empty
                expect(response.body.msg).to.eq("Post removido")
                console.log(response.body);
            })
        });
    })
});