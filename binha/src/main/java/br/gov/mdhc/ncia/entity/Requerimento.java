package br.gov.mdhc.ncia.entity;

import java.util.Date;
import java.util.List;

public class Requerimento {
	
	private String Id;
	private String NumeroSei;
	private String CPF;
	private String NomeRequerente;
	private Date DataNascimento;
	private Enum Estado;
	private Enum Hipotese;
	private Enum GrupoAtendimento;
	private Enum Etapa;
	private List<Requerimento> ProcessosRelacionados;
	private Enum StatusProcesso;
	public String getId() {
		return Id;
	}
	public void setId(String id) {
		Id = id;
	}
	public String getNumeroSei() {
		return NumeroSei;
	}
	public void setNumeroSei(String numeroSei) {
		NumeroSei = numeroSei;
	}
	public String getCPF() {
		return CPF;
	}
	public void setCPF(String cPF) {
		CPF = cPF;
	}
	public String getNomeRequerente() {
		return NomeRequerente;
	}
	public void setNomeRequerente(String nomeRequerente) {
		NomeRequerente = nomeRequerente;
	}
	public Date getDataNascimento() {
		return DataNascimento;
	}
	public void setDataNascimento(Date dataNascimento) {
		DataNascimento = dataNascimento;
	}
	public Enum getEstado() {
		return Estado;
	}
	public void setEstado(Enum estado) {
		Estado = estado;
	}
	public Enum getHipotese() {
		return Hipotese;
	}
	public void setHipotese(Enum hipotese) {
		Hipotese = hipotese;
	}
	public Enum getGrupoAtendimento() {
		return GrupoAtendimento;
	}
	public void setGrupoAtendimento(Enum grupoAtendimento) {
		GrupoAtendimento = grupoAtendimento;
	}
	public Enum getEtapa() {
		return Etapa;
	}
	public void setEtapa(Enum etapa) {
		Etapa = etapa;
	}
	public List<Requerimento> getProcessosRelacionados() {
		return ProcessosRelacionados;
	}
	public void setProcessosRelacionados(List<Requerimento> processosRelacionados) {
		ProcessosRelacionados = processosRelacionados;
	}
	public Enum getStatusProcesso() {
		return StatusProcesso;
	}
	public void setStatusProcesso(Enum statusProcesso) {
		StatusProcesso = statusProcesso;
	}
}
