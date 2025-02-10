"use client";

import styled from "styled-components";
import { useState } from "react";
import Link from 'next/link'

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeftSide = styled.div`
  background: #232323;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RightSide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  flex-wrap: wrap;
  width:100%;
`;


const FieldGroup = styled.div`
  margin-bottom: 15px;
  width:100%;
`;

const ButtonSubmit = styled.button`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 6px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.inputBackground};
  font-size: 16px;
  font-weight: 400;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ForgotPassword = styled.div`
  width: 100%;
  padding: 12px;
  font-weight: 400;
  font-size: 16px;
  line-height: 20.83px;
  letter-spacing: 0%;
  text-align: center;
  text-decoration: underline;
  text-decoration-style: solid;
  text-decoration-offset: Auto;
  text-decoration-thickness: Auto;
  margin: 20px 0;
`;

const SignUp = styled.div`
  width: 100%;
  font-weight: 400;
  font-size: 16px;
  line-height: 20.83px;
  letter-spacing: 0%;
  text-align: center;

  a{
    text-decoration: underline;
  }
`;



export default function LoginPage() {

  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Form submitted')

  }
  
  return (
    <Container>
      <LeftSide />
      <RightSide>
        <form style={{width: '90%', maxWidth:422}} onSubmit={handleSubmit}>
          <h2 style={{marginBottom: '20px'}}>Entrar</h2>
          <FieldGroup>
            <label>CPF</label>
            <Input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="000.000.000-00"
            />
          </FieldGroup>
          <FieldGroup>
            <label>Senha</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
            />
          </FieldGroup>
          <ButtonSubmit type="submit">Entrar →</ButtonSubmit>

          <ForgotPassword>Esqueci minha senha</ForgotPassword>

          <SignUp>Sua primeira vez aqui? <Link href="/signup">Cadastra-se</Link> </SignUp>

        </form>
      </RightSide>
    </Container>
  );
}
