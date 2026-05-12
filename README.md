# Daily Diet

Este repositório contém o desenvolvimento da **Daily Diet API**, uma API para **controle de dieta diária**.

## Objetivo

Permitir que usuários registrem e gerenciem refeições ao longo do tempo, com métricas sobre aderência à dieta e acesso restrito aos próprios dados.

## Regras da aplicação

- Deve ser possível **criar um usuário**.
- Deve ser possível **identificar o usuário entre as requisições**.
- Deve ser possível **registrar uma refeição**, com as seguintes informações:

  *As refeições devem ser relacionadas a um usuário.*

  - Nome  
  - Descrição  
  - Data e hora  
  - Está dentro ou não da dieta  

- Deve ser possível **editar uma refeição**, podendo alterar todos os dados acima.
- Deve ser possível **apagar uma refeição**.
- Deve ser possível **listar todas as refeições** de um usuário.
- Deve ser possível **visualizar uma única refeição**.
- Deve ser possível **recuperar as métricas** de um usuário:
  - Quantidade total de refeições registradas  
  - Quantidade total de refeições dentro da dieta  
  - Quantidade total de refeições fora da dieta  
  - Melhor sequência de refeições dentro da dieta  

- O usuário só pode **visualizar, editar e apagar as refeições que ele mesmo criou**.
